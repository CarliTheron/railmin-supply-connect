
import { supabase } from "@/integrations/supabase/client";

export const fetchSuppliers = async () => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchInventory = async () => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*');

  if (error) throw error;
  return data;
};

export const fetchWheelMotor = async () => {
  const { data, error } = await supabase
    .from('wheelmotor')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
