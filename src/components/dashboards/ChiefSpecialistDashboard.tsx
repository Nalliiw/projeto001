import React from "react";
import SpecialistDashboard from "./SpecialistDashboard";

// Chief Specialist Dashboard extends the Specialist Dashboard
// with additional permissions that are handled by the auth context
// The UI is the same, but the permissions allow for team management
// and clinic administration features to be accessible
const ChiefSpecialistDashboard = () => {
  return <SpecialistDashboard />;
};

export default ChiefSpecialistDashboard;
