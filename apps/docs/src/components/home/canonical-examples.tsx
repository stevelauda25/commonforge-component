import type { ComponentType } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from 'pod-test-ui';

export function ButtonExample() {
  return (
    <Button
      leftIcon={<ChevronLeft className="h-4 w-4" />}
      rightIcon={<ChevronRight className="h-4 w-4" />}
    >
      Button
    </Button>
  );
}

export const canonicalExamples: Record<string, ComponentType> = {
  '/components/button': ButtonExample,
};
