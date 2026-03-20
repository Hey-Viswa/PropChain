interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6 xl:mb-8 gap-4">
      <div className="min-w-0">
        <h1 className="text-headline-md font-semibold text-on_surface font-display">
          {title}
        </h1>
        {subtitle && (
          <p className="text-body-md text-on_surface_variant mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
