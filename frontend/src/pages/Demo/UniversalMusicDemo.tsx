import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

// Mock data based on the schema from OVERVIEW.md
const mockReleaseTypes = [
  "album",
  "single",
  "EP",
  "compilation",
  "soundtrack",
  "live recording",
  "remix",
];

const mockTerritories = [
  "WORLDWIDE",
  "US",
  "EU",
  "ASIA",
  "LATAM",
  "OCEANIA",
  "AFRICA",
];

const mockRightsTypes = [
  "Master Recording",
  "Composition",
  "Publishing",
  "Performance",
  "Mechanical",
  "Synchronization",
  "Print",
];

const mockLabels = [
  { name: "Universal Music Group", id: "UMG001" },
  { name: "Republic Records", id: "REP001" },
  { name: "Interscope Records", id: "INT001" },
  { name: "Capitol Records", id: "CAP001" },
  { name: "Def Jam Recordings", id: "DEF001" },
  { name: "Island Records", id: "ISL001" },
];

const mockGenres = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "R&B",
  "Electronic",
  "Country",
  "Jazz",
  "Classical",
  "Folk",
  "Reggae",
];

const mockDistributionPlatforms = [
  "Spotify",
  "Apple Music",
  "Amazon Music",
  "YouTube Music",
  "Tidal",
  "Deezer",
  "Pandora",
  "SoundCloud",
];

const mockCollectingOrganizations = [
  "ASCAP",
  "BMI",
  "SESAC",
  "SoundExchange",
  "PRS",
  "GEMA",
  "SACEM",
];

interface FormData {
  title: string;
  releaseType: string;
  upc: string;
  catalogNumber: string;
  releaseDate: string;
  label: string;
  genre: string[];
  territories: string[];
  distributionPlatforms: string[];
  trackTitle: string;
  isrc: string;
  compositionTitle: string;
  iswc: string;
  writers: string;
  publishers: string;
  collectingOrganization: string;
  royaltyRate: string;
  notes: string;
}

export const UniversalMusicDemo = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    releaseType: "",
    upc: "",
    catalogNumber: "",
    releaseDate: "",
    label: "",
    genre: [],
    territories: [],
    distributionPlatforms: [],
    trackTitle: "",
    isrc: "",
    compositionTitle: "",
    iswc: "",
    writers: "",
    publishers: "",
    collectingOrganization: "",
    royaltyRate: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load Montserrat font
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    arrayName: keyof FormData,
  ) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        [arrayName]: [...(prev[arrayName] as string[]), value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [arrayName]: (prev[arrayName] as string[]).filter(
          (item) => item !== value,
        ),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      console.log("Submitted data:", formData);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          title: "",
          releaseType: "",
          upc: "",
          catalogNumber: "",
          releaseDate: "",
          label: "",
          genre: [],
          territories: [],
          distributionPlatforms: [],
          trackTitle: "",
          isrc: "",
          compositionTitle: "",
          iswc: "",
          writers: "",
          publishers: "",
          collectingOrganization: "",
          royaltyRate: "",
          notes: "",
        });
      }, 3000);
    }, 1500);
  };

  const generateRandomISRC = () => {
    const countryCode = "US";
    const registrantCode = "UMG";
    const year = new Date().getFullYear().toString().slice(2);
    const designation = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(5, "0");
    return `${countryCode}${registrantCode}${year}${designation}`;
  };

  const generateRandomUPC = () => {
    return (
      "6" +
      Math.floor(Math.random() * 10000000000000)
        .toString()
        .padStart(11, "0")
    );
  };

  const generateRandomISWC = () => {
    return `T-${Math.floor(Math.random() * 1000000000)}-${Math.floor(Math.random() * 10)}`;
  };

  const autofillForm = () => {
    const randomReleaseType =
      mockReleaseTypes[Math.floor(Math.random() * mockReleaseTypes.length)];
    const randomLabel =
      mockLabels[Math.floor(Math.random() * mockLabels.length)];
    const randomGenres = mockGenres.filter(() => Math.random() > 0.7);
    const randomTerritories = mockTerritories.filter(() => Math.random() > 0.5);
    const randomPlatforms = mockDistributionPlatforms.filter(
      () => Math.random() > 0.3,
    );
    const randomCollectingOrg =
      mockCollectingOrganizations[
        Math.floor(Math.random() * mockCollectingOrganizations.length)
      ];

    setFormData({
      title: `New ${randomReleaseType.charAt(0).toUpperCase() + randomReleaseType.slice(1)} ${new Date().getFullYear()}`,
      releaseType: randomReleaseType,
      upc: generateRandomUPC(),
      catalogNumber: `${randomLabel.id}-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
      releaseDate: new Date(
        Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split("T")[0],
      label: randomLabel.name,
      genre: randomGenres.length ? randomGenres : [mockGenres[0]],
      territories: randomTerritories.length ? randomTerritories : ["WORLDWIDE"],
      distributionPlatforms: randomPlatforms.length
        ? randomPlatforms
        : [mockDistributionPlatforms[0]],
      trackTitle: `Track ${Math.floor(Math.random() * 10) + 1}`,
      isrc: generateRandomISRC(),
      compositionTitle: `Composition ${Math.floor(Math.random() * 10) + 1}`,
      iswc: generateRandomISWC(),
      writers: "Songwriter Name (50%), Co-writer Name (50%)",
      publishers: "Publisher Name (50%), Co-publisher Name (50%)",
      collectingOrganization: randomCollectingOrg,
      royaltyRate: (Math.random() * 20 + 10).toFixed(2) + "%",
      notes:
        "Auto-generated submission for demo purposes based on Story Protocol schema.",
    });
  };

  return (
    <>
      <Helmet>
        <style>
          {`
            body {
              font-family: 'Montserrat', sans-serif;
              background-color: #000;
              color: #fff;
              margin: 0;
              padding: 0;
            }
            
            /* Override any inherited styles */
            #umg-demo-container {
              margin-left: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              font-family: 'Montserrat', sans-serif !important;
            }
            
            #umg-demo-container * {
              font-family: 'Montserrat', sans-serif !important;
            }
            
            #umg-demo-container .btn-umg {
              background-color: #FF0031;
              color: white;
              transition: background-color 0.3s;
            }
            
            #umg-demo-container .btn-umg:hover {
              background-color: #CC0028;
            }
            
            #umg-demo-container .umg-header {
              background-color: #000;
              border-bottom: 1px solid #333;
            }
            
            #umg-demo-container .umg-input {
              border-color: #333;
              background-color: #111;
            }
            
            #umg-demo-container .umg-input:focus {
              border-color: #FF0031;
              box-shadow: 0 0 0 1px #FF0031;
            }
          `}
        </style>
      </Helmet>

      <div id="umg-demo-container" className="min-h-screen bg-black">
        <header className="umg-header sticky top-0 z-10 flex items-center justify-between bg-black p-4 shadow-md">
          <div className="flex items-center gap-4">
            <img
              src="/umg.png"
              alt="Universal Music Group Logo"
              className="h-12 w-auto"
            />
            <h1 className="text-xl font-bold text-white">
              Universal Music Group
            </h1>
          </div>
          <div>
            <button
              onClick={autofillForm}
              className="btn-umg rounded-md px-6 py-3 text-base font-medium"
            >
              SIMULATE AGENT INPUT
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              Metadata Submission Portal
            </h1>
            <p className="mt-2 text-gray-400">
              Register your music rights with Story Protocol
            </p>
          </div>

          {isSubmitted ? (
            <div className="rounded-xl bg-green-900/20 p-6 text-center">
              <svg
                className="mx-auto h-16 w-16 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                Submission Successful!
              </h2>
              <p className="mt-2 text-gray-400">
                Your metadata has been submitted to the Dérive platform for
                registration with Story Protocol.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="rounded-xl bg-[#111] p-6">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  Release Information
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      Release Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="releaseType"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      Release Type
                    </label>
                    <select
                      id="releaseType"
                      name="releaseType"
                      value={formData.releaseType}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      required
                    >
                      <option value="">Select Type</option>
                      {mockReleaseTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="upc"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      UPC
                    </label>
                    <input
                      type="text"
                      id="upc"
                      name="upc"
                      value={formData.upc}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      placeholder="e.g., 602567924128"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="catalogNumber"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      Catalog Number
                    </label>
                    <input
                      type="text"
                      id="catalogNumber"
                      name="catalogNumber"
                      value={formData.catalogNumber}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      placeholder="e.g., LABEL001"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="releaseDate"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      Release Date
                    </label>
                    <input
                      type="date"
                      id="releaseDate"
                      name="releaseDate"
                      value={formData.releaseDate}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="label"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      Label
                    </label>
                    <select
                      id="label"
                      name="label"
                      value={formData.label}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      required
                    >
                      <option value="">Select Label</option>
                      {mockLabels.map((label) => (
                        <option key={label.id} value={label.name}>
                          {label.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-400">
                      Genre
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {mockGenres.map((genre) => (
                        <div key={genre} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`genre-${genre}`}
                            name="genre"
                            value={genre}
                            checked={(formData.genre as string[]).includes(
                              genre,
                            )}
                            onChange={(e) => handleCheckboxChange(e, "genre")}
                            className="mr-2 h-4 w-4 rounded border-gray-700 bg-[#111] text-[#FF0031] focus:ring-[#FF0031]"
                          />
                          <label
                            htmlFor={`genre-${genre}`}
                            className="text-sm text-white"
                          >
                            {genre}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-400">
                      Territories
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {mockTerritories.map((territory) => (
                        <div key={territory} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`territory-${territory}`}
                            name="territories"
                            value={territory}
                            checked={(
                              formData.territories as string[]
                            ).includes(territory)}
                            onChange={(e) =>
                              handleCheckboxChange(e, "territories")
                            }
                            className="mr-2 h-4 w-4 rounded border-gray-700 bg-[#111] text-[#FF0031] focus:ring-[#FF0031]"
                          />
                          <label
                            htmlFor={`territory-${territory}`}
                            className="text-sm text-white"
                          >
                            {territory}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-400">
                      Distribution Platforms
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {mockDistributionPlatforms.map((platform) => (
                        <div key={platform} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`platform-${platform}`}
                            name="distributionPlatforms"
                            value={platform}
                            checked={(
                              formData.distributionPlatforms as string[]
                            ).includes(platform)}
                            onChange={(e) =>
                              handleCheckboxChange(e, "distributionPlatforms")
                            }
                            className="mr-2 h-4 w-4 rounded border-gray-700 bg-[#111] text-[#FF0031] focus:ring-[#FF0031]"
                          />
                          <label
                            htmlFor={`platform-${platform}`}
                            className="text-sm text-white"
                          >
                            {platform}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-[#111] p-6">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  Track Information
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="trackTitle"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      Track Title
                    </label>
                    <input
                      type="text"
                      id="trackTitle"
                      name="trackTitle"
                      value={formData.trackTitle}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="isrc"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      ISRC
                    </label>
                    <input
                      type="text"
                      id="isrc"
                      name="isrc"
                      value={formData.isrc}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      placeholder="e.g., USUMG2312345"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="compositionTitle"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      Composition Title
                    </label>
                    <input
                      type="text"
                      id="compositionTitle"
                      name="compositionTitle"
                      value={formData.compositionTitle}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      placeholder="May differ from track title"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="iswc"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      ISWC
                    </label>
                    <input
                      type="text"
                      id="iswc"
                      name="iswc"
                      value={formData.iswc}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      placeholder="e.g., T-123456789-0"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="writers"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      Writers (with splits)
                    </label>
                    <input
                      type="text"
                      id="writers"
                      name="writers"
                      value={formData.writers}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      placeholder="e.g., Songwriter Name (50%), Co-writer (50%)"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="publishers"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      Publishers (with splits)
                    </label>
                    <input
                      type="text"
                      id="publishers"
                      name="publishers"
                      value={formData.publishers}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      placeholder="e.g., Publisher Name (50%), Co-publisher (50%)"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="collectingOrganization"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      Collecting Organization
                    </label>
                    <select
                      id="collectingOrganization"
                      name="collectingOrganization"
                      value={formData.collectingOrganization}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                    >
                      <option value="">Select Organization</option>
                      {mockCollectingOrganizations.map((org) => (
                        <option key={org} value={org}>
                          {org}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="royaltyRate"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      Royalty Rate
                    </label>
                    <input
                      type="text"
                      id="royaltyRate"
                      name="royaltyRate"
                      value={formData.royaltyRate}
                      onChange={handleInputChange}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      placeholder="e.g., 15%"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="notes"
                      className="mb-2 block text-sm font-medium text-gray-400"
                    >
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="umg-input w-full rounded-lg border border-gray-700 bg-[#111] px-4 py-2 text-white focus:outline-none"
                      placeholder="Any additional information about this release..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-umg rounded-lg px-6 py-3 font-medium disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Submit Metadata"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <footer className="mt-12 border-t border-gray-800 bg-black p-6 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Universal Music Group. All rights
            reserved.
          </p>
          <p className="mt-2">Powered by Dérive & Story Protocol</p>
        </footer>
      </div>
    </>
  );
};
