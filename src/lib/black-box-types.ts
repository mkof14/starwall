export type BlackBoxType = "conversation" | "scenario";
export type StorageLocation = "local" | "cloud" | "both";

export type BlackBoxRecord = {
  id: string;
  timestamp: string;
  type: BlackBoxType;
  summary: string;
  fullContent: string;
  storageLocation: StorageLocation;
  pdfEnabled: boolean;
};
