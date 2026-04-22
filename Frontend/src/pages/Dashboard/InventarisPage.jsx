import React from "react";
import LayoutInventaris from "../../components/Layout/LayoutInventaris";
import InventoriBibit from "../../components/ComponentInventaris/InventoriBibit";
import InventoriBaku from "../../components/ComponentInventaris/InventoriBaku";

const InventarisPage = () => {
  return (
    <LayoutInventaris>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InventoriBibit />
        <InventoriBaku />
      </div>
    </LayoutInventaris>
  );
};

export default InventarisPage;
