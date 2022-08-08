export declare const log: (module_name: string) => () => string;
export declare const serializeToJSON: (literal: any) => string;
export declare const deserializeFromJSON: (json_string: string) => any;
export declare const encrypt: (val: string, encryption_key: string, encryption_iv: string) => string;
export declare const decrypt: (encrypted: string, encryption_key: string, encryption_iv: string) => string;
export declare const dates: {
    created_date: string;
    updated_date: string;
};
export declare const createClient: (endpoints?: string) => any;
//# sourceMappingURL=util.d.ts.map