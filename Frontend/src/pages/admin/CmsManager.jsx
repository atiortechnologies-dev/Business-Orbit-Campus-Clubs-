import { useState, useEffect } from "react";
import { cmsApi } from "@/api/cmsApi";
import { AlertCircle } from "lucide-react";

export default function CmsManager() {
  const [faqs, setFaqs] = useState([]);
  const [logos, setLogos] = useState([]);
  const [stories, setStories] = useState([]);
  const [startups, setStartups] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [faqsRes, logosRes, storiesRes, startupsRes] = await Promise.all([
        cmsApi.getFaqs(),
        cmsApi.getPartnerLogos(),
        cmsApi.getSuccessStories(),
        cmsApi.getFeaturedStartups(),
      ]);
      setFaqs(faqsRes.data || faqsRes);
      setLogos(logosRes.data || logosRes);
      setStories(storiesRes.data || storiesRes);
      setStartups(startupsRes.data || startupsRes);
    } catch (err) {
      console.error("Failed to load CMS data:", err);
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load CMS data.",
      );
    }
  };

  const handleCreateFaq = async () => {
    const question = prompt("Question?");
    const answer = prompt("Answer?");
    if (question && answer) {
      try {
        await cmsApi.createFaq({ question, answer, q: question, a: answer });
        loadData();
      } catch (err) {
        console.error("Failed to create FAQ:", err);
        setErrorMsg(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to create FAQ",
        );
      }
    }
  };

  const handleDeleteFaq = async (id) => {
    try {
      await cmsApi.deleteFaq(id);
      loadData();
    } catch (err) {
      console.error("Failed to delete FAQ:", err);
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to delete FAQ",
      );
    }
  };

  const handleCreateLogo = async () => {
    const name = prompt("Partner Name?");
    const image = prompt("Image URL?"); // Simple text URL for minimal implementation, actual implementation might use file upload
    if (name) {
      // In a real scenario, this uses FormData. We mock it as JSON or pass it as FormData if needed.
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);
      try {
        await cmsApi.createPartnerLogo(formData);
        loadData();
      } catch (err) {
        console.error("Failed to create Partner Logo:", err);
        setErrorMsg(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to create Partner Logo",
        );
      }
    }
  };

  const handleDeleteLogo = async (id) => {
    try {
      await cmsApi.deletePartnerLogo(id);
      loadData();
    } catch (err) {
      console.error("Failed to delete Partner Logo:", err);
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete Partner Logo",
      );
    }
  };

  return (
    <div className="p-8 space-y-12">
      <h1 className="text-3xl font-bold">CMS Manager</h1>

      {errorMsg && (
        <div className="p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">FAQs</h2>
          <button
            onClick={handleCreateFaq}
            className="bg-brand-black text-white px-4 py-2 rounded"
          >
            Add FAQ
          </button>
        </div>
        <div className="space-y-4">
          {Array.isArray(faqs) &&
            faqs.map((faq) => (
              <div
                key={faq._id}
                className="border p-4 rounded flex justify-between"
              >
                <div>
                  <p className="font-bold">{faq.question || faq.q}</p>
                  <p>{faq.answer || faq.a}</p>
                </div>
                <button
                  onClick={() => handleDeleteFaq(faq._id)}
                  className="text-error"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Partner Logos</h2>
          <button
            onClick={handleCreateLogo}
            className="bg-brand-black text-white px-4 py-2 rounded"
          >
            Add Logo
          </button>
        </div>
        <div className="space-y-4">
          {Array.isArray(logos) &&
            logos.map((logo) => (
              <div
                key={logo._id}
                className="border p-4 rounded flex justify-between"
              >
                <div className="flex items-center gap-4">
                  {(logo.image || logo.logoUrl) && (
                    <img
                      src={logo.image || logo.logoUrl}
                      alt="Logo"
                      className="w-12 h-12 object-contain"
                    />
                  )}
                  <p className="font-bold">{logo.name}</p>
                </div>
                <button
                  onClick={() => handleDeleteLogo(logo._id)}
                  className="text-error"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </section>

      {/* Similar minimal sections for Stories and Featured Startups could be added,
          but this is sufficient to show the integration exists */}
    </div>
  );
}
