import { ReactNode } from "react";

interface GenericPageProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const GenericPage = ({ title, subtitle, children }: GenericPageProps) => (
  <div className="space-y-6">
    <div><h1 className="page-title">{title}</h1><p className="page-subtitle">{subtitle}</p></div>
    {children}
  </div>
);

export default GenericPage;
