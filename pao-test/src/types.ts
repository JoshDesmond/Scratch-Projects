export interface PAOEntry {
  number: string;
  person: string;
  action: string;
  object: string;
}

export type PAOData = Map<string, PAOEntry>;

export interface Stats {
  persons: Record<string, number>;
  actions: Record<string, number>;
  objects: Record<string, number>;
  failures?: {
    persons: Record<string, number>;
    actions: Record<string, number>;
    objects: Record<string, number>;
  };
}
