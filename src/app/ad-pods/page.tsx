'use client';

import { useState } from 'react';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Package } from 'lucide-react';
import { AdPod } from '@/types';
import PodCreationDialog from '@/components/ad-pods/pod-creation-dialog';
import PodListTable from '@/components/ad-pods/pod-list-table';

export default function AdPodsPage() {
  const [pods, setPods] = useState<AdPod[]>([]);
  const [showCreationDialog, setShowCreationDialog] = useState(false);

  const handlePodCreated = (pod: AdPod) => {
    setPods(prev => [...prev, pod]);
    setShowCreationDialog(false);
  };

  const handleDeletePod = (podId: string) => {
    setPods(prev => prev.filter(p => p.id !== podId));
  };

  return (
    <>
      <PageHeader 
        title="Ad Pod Compiler" 
        description="Create deterministic, upstream-controlled weekly ad pods for theatres."
      >
        <Button onClick={() => setShowCreationDialog(true)}>
          <PlusCircle /> Create New Pod
        </Button>
      </PageHeader>

      <div className="space-y-6">
        {pods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/50">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Ad Pods Created</h3>
            <p className="text-muted-foreground mb-4">
              Create your first ad pod to get started.
            </p>
            <Button onClick={() => setShowCreationDialog(true)}>
              <PlusCircle /> Create Ad Pod
            </Button>
          </div>
        ) : (
          <PodListTable pods={pods} onDelete={handleDeletePod} />
        )}
      </div>

      <PodCreationDialog
        open={showCreationDialog}
        onOpenChange={setShowCreationDialog}
        onPodCreated={handlePodCreated}
      />
    </>
  );
}
