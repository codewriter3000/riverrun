import { useNavigate } from "react-router-dom";
import CaseList from "../components/cases/CaseList";

export const CasesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEdit = (caseId: string) => {
    navigate(`/cases/${caseId}`);
  };

  return (
    <div className="cases-page">
      <h1>Cases</h1>
      <CaseList onDetails={handleEdit} />
    </div>
  );
};
