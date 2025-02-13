
export interface InventoryItem {
  id: string;
  part_number: string;
  description: string | null;
  total_cost: string | null;
  country: string | null;
  itemcode?: string;
  itemdescription?: string | null;
  MFG?: string | null;
  "PN#"?: string | null;
  Description?: string | null;
}
