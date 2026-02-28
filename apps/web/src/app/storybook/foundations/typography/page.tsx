const TYPE_SCALE = [
  { cls: 'display-1', size: '2.875rem', lineHeight: '3.875rem' },
  { cls: 'heading-1', size: '2.125rem', lineHeight: '3rem' },
  { cls: 'heading-2', size: '1.75rem', lineHeight: '2.5rem' },
  { cls: 'heading-3', size: '1.5rem', lineHeight: '2.25rem' },
  { cls: 'heading-4', size: '1.25rem', lineHeight: '2rem' },
  { cls: 'subheading-1', size: '1.25rem', lineHeight: '1.875rem' },
  { cls: 'subheading-2', size: '1.125rem', lineHeight: '1.625rem' },
  { cls: 'subheading-3', size: '1rem', lineHeight: '1.5rem' },
  { cls: 'body-1', size: '1.25rem', lineHeight: '1.875rem' },
  { cls: 'body-2', size: '1.125rem', lineHeight: '1.625rem' },
  { cls: 'body-3', size: '1rem', lineHeight: '1.5rem' },
  { cls: 'label-1', size: '0.875rem', lineHeight: '1.375rem' },
  { cls: 'label-2', size: '0.75rem', lineHeight: '1.25rem' },
] as const;

const SAMPLE_TEXT = '모임을 만들어 보세요';

const TypographyPage = () => {
  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">Typography</h1>
      <p className="mb-8 body-3 text-neutral-700">모든 텍스트 스케일. letter-spacing: -0.01%</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-neutral-300">
              <th className="py-2 pr-4 text-left label-2 font-semibold text-neutral-600">Class</th>
              <th className="py-2 pr-4 text-left label-2 font-semibold text-neutral-600">Size</th>
              <th className="py-2 pr-4 text-left label-2 font-semibold text-neutral-600">
                Line Height
              </th>
              <th className="py-2 text-left label-2 font-semibold text-neutral-600">Preview</th>
            </tr>
          </thead>
          <tbody>
            {TYPE_SCALE.map(({ cls, size, lineHeight }) => (
              <tr key={cls} className="border-b border-neutral-200">
                <td className="py-4 pr-4 font-mono text-[11px] text-orange-600">.{cls}</td>
                <td className="py-4 pr-4 label-2 text-neutral-600">{size}</td>
                <td className="py-4 pr-4 label-2 text-neutral-600">{lineHeight}</td>
                <td className="py-4">
                  <span className={`${cls} text-neutral-1400`}>{SAMPLE_TEXT}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 label-1 font-semibold text-neutral-800">Font Weights</h2>
        <div className="flex flex-col gap-3">
          {[
            { weight: 'font-normal', value: '400' },
            { weight: 'font-medium', value: '500' },
            { weight: 'font-semibold', value: '600' },
            { weight: 'font-bold', value: '700' },
          ].map(({ weight, value }) => (
            <div key={weight} className="flex items-baseline gap-4">
              <span className="w-24 font-mono text-[11px] text-orange-600">.{weight}</span>
              <span className="w-8 label-2 text-neutral-500">{value}</span>
              <span className={`body-3 text-neutral-1400 ${weight}`}>{SAMPLE_TEXT}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TypographyPage;
