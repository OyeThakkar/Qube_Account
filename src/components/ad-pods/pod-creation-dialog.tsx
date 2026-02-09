'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdPod, PodConfiguration, Rating, Section, Aspect, UploadedCPL } from '@/types';
import { parseCPLXML, validateCPLCompatibility, generatePodId, generateDCPPackage, formatPodDate } from '@/lib/ad-pod-utils';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Upload, CheckCircle, XCircle, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PodCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPodCreated: (pod: AdPod) => void;
}

export default function PodCreationDialog({ open, onOpenChange, onPodCreated }: PodCreationDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'config' | 'upload' | 'validate' | 'generate'>('config');
  
  // Configuration state
  const [theatreName, setTheatreName] = useState('');
  const [theatreId, setTheatreId] = useState('');
  const [rating, setRating] = useState<Rating>('G');
  const [section, setSection] = useState<Section>('LPS');
  const [aspect, setAspect] = useState<Aspect>('Flat');
  const [startDate, setStartDate] = useState('');
  
  // Upload state
  const [uploadedCPLs, setUploadedCPLs] = useState<UploadedCPL[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  
  // Generation state
  const [generatedPod, setGeneratedPod] = useState<AdPod | null>(null);

  const resetForm = () => {
    setStep('config');
    setTheatreName('');
    setTheatreId('');
    setRating('G');
    setSection('LPS');
    setAspect('Flat');
    setStartDate('');
    setUploadedCPLs([]);
    setValidationErrors([]);
    setIsValidated(false);
    setGeneratedPod(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newCPLs: UploadedCPL[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const content = await file.text();
        const metadata = parseCPLXML(content, file.name);
        
        newCPLs.push({
          id: `${Date.now()}-${i}`,
          fileName: file.name,
          metadata,
          order: uploadedCPLs.length + i + 1,
          validated: false,
          validationErrors: [],
        });
      } catch (error) {
        toast({
          title: 'Parse Error',
          description: `Failed to parse ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: 'destructive',
        });
      }
    }

    setUploadedCPLs(prev => [...prev, ...newCPLs]);
    setIsValidated(false);
  };

  const handleRemoveCPL = (id: string) => {
    setUploadedCPLs(prev => {
      const filtered = prev.filter(cpl => cpl.id !== id);
      // Reorder remaining CPLs
      return filtered.map((cpl, index) => ({ ...cpl, order: index + 1 }));
    });
    setIsValidated(false);
  };

  const handleValidate = () => {
    const validation = validateCPLCompatibility(uploadedCPLs);
    
    if (validation.valid) {
      setValidationErrors([]);
      setIsValidated(true);
      setUploadedCPLs(prev => prev.map(cpl => ({ ...cpl, validated: true, validationErrors: [] })));
      toast({
        title: 'Validation Successful',
        description: 'All CPLs are compatible and ready for stitching.',
      });
      setStep('generate');
    } else {
      setValidationErrors(validation.errors);
      setIsValidated(false);
      toast({
        title: 'Validation Failed',
        description: `Found ${validation.errors.length} validation error(s).`,
        variant: 'destructive',
      });
    }
  };

  const handleGenerate = () => {
    try {
      const config: PodConfiguration = {
        theatreName,
        theatreId,
        rating,
        section,
        aspect,
        startDate,
        cpls: uploadedCPLs,
      };

      const dcpPackage = generateDCPPackage(config);
      const podId = generatePodId(config);

      const pod: AdPod = {
        id: `${Date.now()}`,
        podName: podId,
        configuration: config,
        status: 'generated',
        createdAt: new Date().toISOString(),
        generatedAt: new Date().toISOString(),
      };

      setGeneratedPod(pod);
      
      toast({
        title: 'Pod Generated Successfully',
        description: `Pod ${podId} has been created.`,
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadPackage = () => {
    if (!generatedPod) return;

    try {
      const config: PodConfiguration = generatedPod.configuration;
      const dcpPackage = generateDCPPackage(config);

      // Create a text file with package information
      const packageInfo = `DCP Package: ${dcpPackage.podName}
=====================================

ASSETMAP.xml
------------
${dcpPackage.assetMap}

PKL.xml
-------
${dcpPackage.pkl}

CPL.xml
-------
${dcpPackage.cpl}

MXF References (${dcpPackage.mxfReferences.length})
--------------
${dcpPackage.mxfReferences.join('\n')}
`;

      const blob = new Blob([packageInfo], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dcpPackage.podName}_package.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Package Downloaded',
        description: 'DCP package information has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleFinish = () => {
    if (generatedPod) {
      onPodCreated(generatedPod);
      resetForm();
      onOpenChange(false);
    }
  };

  const canProceedToUpload = theatreName && theatreId && startDate;
  const canValidate = uploadedCPLs.length > 0;
  const canGenerate = isValidated && uploadedCPLs.length > 0;

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Ad Pod</DialogTitle>
          <DialogDescription>
            Create a deterministic weekly ad pod for theatre delivery
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {step === 'config' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theatreName">Theatre Name</Label>
                  <Input
                    id="theatreName"
                    value={theatreName}
                    onChange={(e) => setTheatreName(e.target.value)}
                    placeholder="e.g., Cinema Paradiso"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theatreId">Theatre ID</Label>
                  <Input
                    id="theatreId"
                    value={theatreId}
                    onChange={(e) => setTheatreId(e.target.value.toUpperCase())}
                    placeholder="e.g., T1042"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Select value={rating} onValueChange={(value) => setRating(value as Rating)}>
                    <SelectTrigger id="rating">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="G">G</SelectItem>
                      <SelectItem value="PG">PG</SelectItem>
                      <SelectItem value="PG-13">PG-13</SelectItem>
                      <SelectItem value="R">R</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Select value={section} onValueChange={(value) => setSection(value as Section)}>
                    <SelectTrigger id="section">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LPS">LPS (Late Pre-Show)</SelectItem>
                      <SelectItem value="EPS">EPS (Early Pre-Show)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aspect">Aspect Ratio</Label>
                  <Select value={aspect} onValueChange={(value) => setAspect(value as Aspect)}>
                    <SelectTrigger id="aspect">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flat">Flat (1.85:1)</SelectItem>
                      <SelectItem value="Scope">Scope (2.39:1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date (dd-mmm-yyyy)</Label>
                <Input
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="e.g., 06-Feb-2026"
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep('upload')} 
                  disabled={!canProceedToUpload}
                >
                  Next: Upload CPLs
                </Button>
              </div>
            </div>
          )}

          {step === 'upload' && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Upload CPL XML files in the order they should play. Maximum 20 CPLs per pod.
                </AlertDescription>
              </Alert>

              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <Label
                  htmlFor="cplUpload"
                  className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                >
                  Click to upload CPL files or drag and drop
                </Label>
                <Input
                  id="cplUpload"
                  type="file"
                  accept=".xml"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {uploadedCPLs.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded CPLs ({uploadedCPLs.length}/20)</Label>
                  <ScrollArea className="h-64 border rounded-lg p-4">
                    {uploadedCPLs.map((cpl) => (
                      <div key={cpl.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{cpl.order}.</span>
                            <span className="text-sm font-medium">{cpl.fileName}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {cpl.metadata.contentTitle} • {cpl.metadata.editRate} • {cpl.metadata.aspect}
                            {cpl.metadata.encrypted && ' • ⚠️ ENCRYPTED'}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCPL(cpl.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}

              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">Validation Errors:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('config')}>
                  Back
                </Button>
                <Button onClick={handleValidate} disabled={!canValidate}>
                  Validate & Continue
                </Button>
              </div>
            </div>
          )}

          {step === 'generate' && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Validation successful! All CPLs are compatible and ready for stitching.
                </AlertDescription>
              </Alert>

              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">Pod Configuration</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Theatre:</span>{' '}
                    <span className="font-medium">{theatreName} ({theatreId})</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rating:</span>{' '}
                    <span className="font-medium">{rating}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Section:</span>{' '}
                    <span className="font-medium">{section}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Aspect:</span>{' '}
                    <span className="font-medium">{aspect}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Start Date:</span>{' '}
                    <span className="font-medium">{startDate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CPLs:</span>{' '}
                    <span className="font-medium">{uploadedCPLs.length}</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground">Pod Name:</span>{' '}
                  <span className="font-mono font-semibold">
                    {generatePodId({ theatreName, theatreId, rating, section, aspect, startDate, cpls: uploadedCPLs })}
                  </span>
                </div>
              </div>

              {generatedPod ? (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Pod generated successfully! You can now download the DCP package.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2">
                    <Button onClick={handleDownloadPackage} variant="outline" className="flex-1">
                      <Download /> Download Package
                    </Button>
                    <Button onClick={handleFinish} className="flex-1">
                      Finish
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('upload')}>
                    Back
                  </Button>
                  <Button onClick={handleGenerate} disabled={!canGenerate}>
                    Generate Pod
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
