import { LayoutTemplate, MessageSquareQuote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GenericPage from "@/components/GenericPage";

const WebsiteControlPage = () => {
  const navigate = useNavigate();

  return (
    <GenericPage
      title="Website Control"
      subtitle="Manage the MegaClick website's content and its CRM integrations."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {/* 1. Templates Card */}
        <button
          type="button"
          onClick={() => navigate("/website-control/templates")}
          className="bg-card border border-border rounded-2xl p-6 text-left hover:bg-muted/40 hover:border-primary/40 transition-all shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <LayoutTemplate className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Templates</h3>
          <p className="text-xs text-muted-foreground mt-1">Manage the website's page templates.</p>
        </button>

        {/* 2. Testimonials Card ⭐ (Image 2 jaisa) */}
        <button
          type="button"
          onClick={() => navigate("/website-control/testimonials")}
          className="bg-card border border-border rounded-2xl p-6 text-left hover:bg-muted/40 hover:border-primary/40 transition-all shadow-sm group"
        >
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground mb-4 group-hover:text-foreground">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Testimonials</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Manage client reviews, ratings, and outcomes.
          </p>
        </button>
      </div>
    </GenericPage>
  );
};

export default WebsiteControlPage;