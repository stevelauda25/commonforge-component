import type { ComponentType } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, TextInput } from 'pod-test-ui';

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

export function TextInputExample() {
  return (
    <div className="w-full max-w-[220px]">
      <TextInput label="Email" placeholder="you@pod.com" />
    </div>
  );
}

export const canonicalExamples: Record<string, ComponentType> = {
  '/components/button': ButtonExample,
  '/components/text-input': TextInputExample,
};
