import { ReactNode } from "react";

interface GenericPageProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

// Some pages already carry their heading in the topbar above — passing no
// title skips the on-page one instead of rendering it twice.
const GenericPage = ({ title, subtitle, children }: GenericPageProps) => (
  <div className="space-y-6">
    {title && (
      <div><h1 className="page-title">{title}</h1>{subtitle && <p className="page-subtitle">{subtitle}</p>}</div>
    )}
    {children}
  </div>
);

export default GenericPage;
