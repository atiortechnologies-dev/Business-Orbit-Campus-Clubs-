import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, AlertCircle, X } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import {
  adminFaqApi,
  adminStatisticApi,
  adminPartnerLogoApi,
  adminSuccessStoryApi,
  adminFeaturedStartupApi,
} from "@/api/admin/adminContentApi";

const TABS = [
  { id: "faqs", label: "FAQs" },
  { id: "statistics", label: "Statistics" },
  { id: "partnerLogos", label: "Partner Logos" },
  { id: "successStories", label: "Success Stories" },
  { id: "featuredStartups", label: "Featured Startups" },
];

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("faqs");
  const [data, setData] = useState({
    faqs: [],
    statistics: [],
    partnerLogos: [],
    successStories: [],
    featuredStartups: [],
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadData = async (tab) => {
    setLoading(true);
    setErrorMsg("");
    try {
      let res;
      if (tab === "faqs") res = await adminFaqApi.getFaqs();
      else if (tab === "statistics") res = await adminStatisticApi.getStatistics();
      else if (tab === "partnerLogos") res = await adminPartnerLogoApi.getPartnerLogos();
      else if (tab === "successStories") res = await adminSuccessStoryApi.getSuccessStories();
      else if (tab === "featuredStartups") res = await adminFeaturedStartupApi.getFeaturedStartups();

      setData((prev) => ({ ...prev, [tab]: res.data?.data || [] }));
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      if (activeTab === "faqs") await adminFaqApi.deleteFaq(id);
      else if (activeTab === "statistics") await adminStatisticApi.deleteStatistic(id);
      else if (activeTab === "partnerLogos") await adminPartnerLogoApi.deletePartnerLogo(id);
      else if (activeTab === "successStories") await adminSuccessStoryApi.deleteSuccessStory(id);
      else if (activeTab === "featuredStartups") await adminFeaturedStartupApi.deleteFeaturedStartup(id);
      
      setData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((item) => item._id !== id),
      }));
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to delete item");
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        let res;
        if (activeTab === "faqs") res = await adminFaqApi.updateFaq(editingItem._id, formData);
        else if (activeTab === "statistics") res = await adminStatisticApi.updateStatistic(editingItem._id, formData);
        else if (activeTab === "partnerLogos") res = await adminPartnerLogoApi.updatePartnerLogo(editingItem._id, formData);
        else if (activeTab === "successStories") res = await adminSuccessStoryApi.updateSuccessStory(editingItem._id, formData);
        else if (activeTab === "featuredStartups") res = await adminFeaturedStartupApi.updateFeaturedStartup(editingItem._id, formData);
        
        setData((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab].map((item) => item._id === editingItem._id ? res.data.data : item),
        }));
      } else {
        let res;
        if (activeTab === "faqs") res = await adminFaqApi.createFaq(formData);
        else if (activeTab === "statistics") res = await adminStatisticApi.createStatistic(formData);
        else if (activeTab === "partnerLogos") res = await adminPartnerLogoApi.createPartnerLogo(formData);
        else if (activeTab === "successStories") res = await adminSuccessStoryApi.createSuccessStory(formData);
        else if (activeTab === "featuredStartups") res = await adminFeaturedStartupApi.createFeaturedStartup(formData);
        
        setData((prev) => ({
          ...prev,
          [activeTab]: [res.data.data, ...prev[activeTab]],
        }));
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save item");
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <AdminShell>
      <div className="p-8 space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-brand-black text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-error/15 border border-error/30 text-error rounded-md text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex space-x-2 border-b border-border-subtle pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-md font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-brand-black text-white"
                : "text-brand-gray hover:bg-canvas-bg"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 border-2 border-border-subtle border-t-brand-black rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-border-subtle overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-canvas-bg">
              <tr>
                <th className="px-4 py-3 font-medium">Content Details</th>
                <th className="px-4 py-3 font-medium w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {data[activeTab].length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-4 py-8 text-center text-brand-gray">
                    No items found.
                  </td>
                </tr>
              ) : (
                data[activeTab].map((item) => (
                  <tr key={item._id} className="hover:bg-canvas-bg transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {item.question || item.title || item.name || item.startupName}
                      </div>
                      <div className="text-sm text-brand-gray mt-1 line-clamp-2">
                        {item.answer || item.value || item.description || item.shortDescription || item.logoUrl}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(item)}
                          className="p-1.5 text-brand-gray hover:text-brand-black transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 text-error hover:opacity-80 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          activeTab={activeTab}
          initialData={editingItem}
          onSave={handleSave}
        />
      )}
      </div>
    </AdminShell>
  );
}

function Modal({ onClose, activeTab, initialData, onSave }) {
  const [formData, setFormData] = useState(initialData || {});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center bg-canvas-bg">
          <h2 className="font-bold text-lg">
            {initialData ? "Edit" : "Add"} {TABS.find((t) => t.id === activeTab)?.label}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          <form id="contentForm" onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "faqs" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Question</label>
                  <input required name="question" value={formData.question || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Answer</label>
                  <textarea required name="answer" value={formData.answer || ""} onChange={handleChange} className="w-full p-2 border rounded-md" rows="3" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Page Type</label>
                  <select required name="pageType" value={formData.pageType || ""} onChange={handleChange} className="w-full p-2 border rounded-md">
                    <option value="">Select...</option>
                    <option value="Main Landing">Main Landing</option>
                    <option value="Student">Student</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Investor">Investor</option>
                    <option value="Incubator">Incubator</option>
                    <option value="Company">Company</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === "statistics" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input required name="title" value={formData.title || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Value</label>
                  <input required name="value" value={formData.value || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Landing Page</label>
                  <select required name="landingPage" value={formData.landingPage || ""} onChange={handleChange} className="w-full p-2 border rounded-md">
                    <option value="">Select...</option>
                    <option value="Main Landing">Main Landing</option>
                    <option value="Student">Student</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Investor">Investor</option>
                    <option value="Company">Company</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === "partnerLogos" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input required name="name" value={formData.name || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Logo URL</label>
                  <input required type="url" name="logoUrl" value={formData.logoUrl || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select required name="category" value={formData.category || ""} onChange={handleChange} className="w-full p-2 border rounded-md">
                    <option value="">Select...</option>
                    <option value="College">College</option>
                    <option value="Technology Partner">Technology Partner</option>
                    <option value="Incubator">Incubator</option>
                    <option value="Startup Partner">Startup Partner</option>
                    <option value="Business Partner">Business Partner</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === "successStories" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input required name="title" value={formData.title || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input required name="name" value={formData.name || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Organization</label>
                  <input required name="organization" value={formData.organization || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea required name="description" value={formData.description || ""} onChange={handleChange} className="w-full p-2 border rounded-md" rows="3" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input type="url" name="image" value={formData.image || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Story Type</label>
                  <select required name="storyType" value={formData.storyType || ""} onChange={handleChange} className="w-full p-2 border rounded-md">
                    <option value="">Select...</option>
                    <option value="Founder">Founder</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Investor">Investor</option>
                    <option value="Incubator">Incubator</option>
                    <option value="Company">Company</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="featured" id="featured" checked={formData.featured || false} onChange={handleChange} />
                  <label htmlFor="featured" className="text-sm">Featured</label>
                </div>
              </>
            )}

            {activeTab === "featuredStartups" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Startup Name</label>
                  <input required name="startupName" value={formData.startupName || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Founder</label>
                  <input required name="founder" value={formData.founder || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stage</label>
                  <input name="stage" value={formData.stage || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Industry</label>
                  <input name="industry" value={formData.industry || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Funding Status</label>
                  <input name="fundingStatus" value={formData.fundingStatus || ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Short Description</label>
                  <textarea name="shortDescription" value={formData.shortDescription || ""} onChange={handleChange} className="w-full p-2 border rounded-md" rows="2" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="featured" id="featured" checked={formData.featured || false} onChange={handleChange} />
                  <label htmlFor="featured" className="text-sm">Featured</label>
                </div>
              </>
            )}
          </form>
        </div>
        <div className="p-4 border-t flex justify-end gap-2 bg-canvas-bg mt-auto">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-black/5">
            Cancel
          </button>
          <button type="submit" form="contentForm" className="px-4 py-2 bg-brand-black text-white rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
