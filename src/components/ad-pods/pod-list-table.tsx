'use client';

import { AdPod } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { generateDCPPackage } from '@/lib/ad-pod-utils';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import PodDetailsDialog from './pod-details-dialog';

interface PodListTableProps {
  pods: AdPod[];
  onDelete: (podId: string) => void;
}

export default function PodListTable({ pods, onDelete }: PodListTableProps) {
  const { toast } = useToast();
  const [selectedPod, setSelectedPod] = useState<AdPod | null>(null);

  const getStatusColor = (status: AdPod['status']) => {
    switch (status) {
      case 'generated':
        return 'default';
      case 'validated':
        return 'secondary';
      case 'draft':
        return 'outline';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleDownload = (pod: AdPod) => {
    try {
      const dcpPackage = generateDCPPackage(pod.configuration);

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
        description: `DCP package for ${pod.podName} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pod Name</TableHead>
              <TableHead>Theatre</TableHead>
              <TableHead>Configuration</TableHead>
              <TableHead>CPLs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pods.map((pod) => (
              <TableRow key={pod.id}>
                <TableCell className="font-mono text-sm">{pod.podName}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{pod.configuration.theatreName}</div>
                    <div className="text-xs text-muted-foreground">{pod.configuration.theatreId}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div>{pod.configuration.rating} • {pod.configuration.section} • {pod.configuration.aspect}</div>
                    <div className="text-xs text-muted-foreground">{pod.configuration.startDate}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{pod.configuration.cpls.length}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(pod.status)}>
                    {pod.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(pod.createdAt), 'MMM d, yyyy HH:mm')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPod(pod)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {pod.status === 'generated' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(pod)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Pod</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete pod <strong>{pod.podName}</strong>?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(pod.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedPod && (
        <PodDetailsDialog
          pod={selectedPod}
          open={selectedPod !== null}
          onOpenChange={(open) => !open && setSelectedPod(null)}
        />
      )}
    </>
  );
}
