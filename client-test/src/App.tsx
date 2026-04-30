import { Button, Checkbox, SearchInput } from 'pod-test-ui';
import { useState } from 'react';

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(false);

  return (
    <div className="max-w-2xl mx-auto p-8 flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold text-accent mb-2">POD Client Test</h1>
        <p className="text-text-muted">Ini adalah project client yang menggunakan library dari NPM.</p>
      </header>

      <section className="p-6 bg-surface border border-border-default rounded-xl flex flex-col gap-6 shadow-sm">
        <h2 className="text-xl font-semibold">Testing Komponen</h2>
        
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="error">Error Button</Button>
        </div>

        <div className="max-w-sm">
          <SearchInput 
            value={searchValue} 
            onValueChange={setSearchValue} 
            placeholder="Cari sesuatu..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <Checkbox 
            checked={checked} 
            onCheckedChange={setChecked}
            label="Setujui syarat dan ketentuan"
            description="Dengan mencentang ini, kamu setuju dengan aturan POD."
          />
        </div>
      </section>

      <footer className="text-center text-xs text-text-disabled">
        Dibuat secara otomatis untuk validasi NPM.
      </footer>
    </div>
  );
}

export default App;
