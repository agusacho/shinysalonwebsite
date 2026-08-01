"use client";

import { useState, useEffect } from "react";
import { insforge } from "@/lib/insforge";
import { Button } from "@/components/ui/Button";

type Service = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
};

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await insforge.database
      .from("services")
      .select("*")
      .order("category")
      .order("name");
      
    if (error) {
      alert("Error fetching services: " + error.message);
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData(service);
  };

  const handleAddNew = () => {
    setEditingId("new");
    setFormData({
      name: "",
      category: "Hair",
      price: 0,
      duration_minutes: 60,
      is_active: true,
      description: ""
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category) {
      alert("Name and category are required");
      return;
    }

    setLoading(true);
    
    if (editingId === "new") {
      const { error } = await insforge.database
        .from("services")
        .insert([formData]);
        
      if (error) alert("Error adding service: " + error.message);
      else {
        alert("Service added successfully!");
        setEditingId(null);
        fetchServices();
      }
    } else {
      const { error } = await insforge.database
        .from("services")
        .update(formData)
        .eq("id", editingId);
        
      if (error) alert("Error updating service: " + error.message);
      else {
        alert("Service updated successfully!");
        setEditingId(null);
        fetchServices();
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    setLoading(true);
    const { error } = await insforge.database
      .from("services")
      .delete()
      .eq("id", id);
      
    if (error) alert("Error deleting service: " + error.message);
    else {
      alert("Service deleted successfully!");
      fetchServices();
    }
    setLoading(false);
  };

  if (loading && services.length === 0) return <div className="p-8">Loading services...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif text-charcoal">Manage Services Catalog</h2>
        <Button onClick={handleAddNew} disabled={loading || editingId !== null}>+ Add New Service</Button>
      </div>

      {editingId && (
        <div className="bg-sand p-6 rounded-xl border border-peach-base mb-8 space-y-4">
          <h3 className="text-lg font-serif font-bold">{editingId === "new" ? "Add New Service" : "Edit Service"}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={formData.category || "Hair"} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 rounded border">
                <option value="Hair">Hair</option>
                <option value="Skin">Skin</option>
                <option value="Nails">Nails</option>
                <option value="Body">Body</option>
                <option value="Spa">Spa</option>
                <option value="Bridal">Bridal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rp)</label>
              <input type="number" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-3 py-2 rounded border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input type="number" value={formData.duration_minutes || 60} onChange={e => setFormData({...formData, duration_minutes: Number(e.target.value)})} className="w-full px-3 py-2 rounded border" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded border min-h-[60px]" />
          </div>

          <div className="flex gap-4 pt-2">
            <Button onClick={handleSave} disabled={loading}>Save Service</Button>
            <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-medium text-gray-600">Category</th>
              <th className="p-4 font-medium text-gray-600">Name</th>
              <th className="p-4 font-medium text-gray-600">Duration</th>
              <th className="p-4 font-medium text-gray-600">Price (Rp)</th>
              <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((svc) => (
              <tr key={svc.id} className="hover:bg-gray-50/50">
                <td className="p-4 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-peach-base/20 text-peach-deep rounded-full text-xs font-medium">
                    {svc.category}
                  </span>
                </td>
                <td className="p-4">
                  <p className="font-medium text-charcoal">{svc.name}</p>
                  {svc.description && <p className="text-xs text-gray-500 mt-1">{svc.description}</p>}
                </td>
                <td className="p-4 text-sm text-gray-600">{svc.duration_minutes} mins</td>
                <td className="p-4 text-sm text-gray-600">{Number(String(svc.price || "0").replace(/\D/g, "")).toLocaleString("id-ID")}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(svc)} className="text-gold-metallic hover:underline text-sm font-medium px-2 py-1">Edit</button>
                  <button onClick={() => handleDelete(svc.id)} className="text-red-500 hover:underline text-sm font-medium px-2 py-1">Delete</button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">No services found. Add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
