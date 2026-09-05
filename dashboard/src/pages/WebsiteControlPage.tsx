import { LayoutTemplate } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GenericPage from "@/components/GenericPage";


const WebsiteControlPage = () => {
  const navigate = useNavigate();

  return (
    <GenericPage
      title="Website Control"
      subtitle="Manage the MegaClick website's content and its CRM integrations."
    >
      <button
        type="button"
        onClick={() => navigate("/website-control/templates")}
        className="bg-card border border-border rounded-2xl p-5 text-left hover:bg-muted/40 hover:border-primary/40 transition-colors w-full sm:w-auto sm:min-w-[260px]"
      >
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground mb-3">
          <LayoutTemplate className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Templates</h3>
        <p className="text-xs text-muted-foreground mt-1">Manage the website's page templates.</p>
      </button>
    </GenericPage>
  );
};

export default WebsiteControlPage;
