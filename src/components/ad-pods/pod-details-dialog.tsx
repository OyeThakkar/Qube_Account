'use client';

import { AdPod } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface PodDetailsDialogProps {
  pod: AdPod;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PodDetailsDialog({ pod, open, onOpenChange }: PodDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-mono">{pod.podName}</DialogTitle>
          <DialogDescription>
            Pod details and configuration
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            {/* Status */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Status</h3>
              <Badge variant={pod.status === 'generated' ? 'default' : 'secondary'}>
                {pod.status}
              </Badge>
            </div>

            <Separator />

            {/* Theatre Configuration */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Theatre Configuration</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Theatre Name:</span>
                  <div className="font-medium">{pod.configuration.theatreName}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Theatre ID:</span>
                  <div className="font-medium font-mono">{pod.configuration.theatreId}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Rating:</span>
                  <div className="font-medium">{pod.configuration.rating}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Section:</span>
                  <div className="font-medium">{pod.configuration.section}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Aspect Ratio:</span>
                  <div className="font-medium">{pod.configuration.aspect}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <div className="font-medium">{pod.configuration.startDate}</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* CPLs */}
            <div>
              <h3 className="text-sm font-semibold mb-3">
                Composition Playlist Order ({pod.configuration.cpls.length} CPLs)
              </h3>
              <div className="space-y-3">
                {pod.configuration.cpls.map((cpl, index) => (
                  <div key={cpl.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium text-sm">{cpl.fileName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span>Title:</span> {cpl.metadata.contentTitle}
                      </div>
                      <div>
                        <span>Edit Rate:</span> {cpl.metadata.editRate}
                      </div>
                      <div>
                        <span>Aspect:</span> {cpl.metadata.aspect}
                      </div>
                      <div>
                        <span>Reels:</span> {cpl.metadata.reels.length}
                      </div>
                      <div className="col-span-2">
                        <span>UUID:</span>{' '}
                        <span className="font-mono">{cpl.metadata.uuid}</span>
                      </div>
                    </div>
                    {cpl.metadata.encrypted && (
                      <Badge variant="destructive" className="text-xs">
                        Encrypted
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Metadata */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Metadata</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Created At:</span>
                  <div className="font-medium">
                    {format(new Date(pod.createdAt), 'MMM d, yyyy HH:mm:ss')}
                  </div>
                </div>
                {pod.generatedAt && (
                  <div>
                    <span className="text-muted-foreground">Generated At:</span>
                    <div className="font-medium">
                      {format(new Date(pod.generatedAt), 'MMM d, yyyy HH:mm:ss')}
                    </div>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-muted-foreground">Pod ID:</span>
                  <div className="font-medium font-mono">{pod.id}</div>
                </div>
              </div>
            </div>

            {pod.errorMessage && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-destructive">Error</h3>
                  <p className="text-sm text-muted-foreground">{pod.errorMessage}</p>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
