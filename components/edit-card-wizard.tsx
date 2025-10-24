"use client";

type Props = { initialCard: any };

export default function EditCardWizard({ initialCard }: Props) {
  return (
    <div className="rounded border p-4 text-sm">
      <h2 className="font-medium mb-2">Edit Card Wizard</h2>
      <pre className="text-xs bg-gray-50 p-2 rounded">
        {JSON.stringify(initialCard, null, 2)}
      </pre>
    </div>
  );
}
