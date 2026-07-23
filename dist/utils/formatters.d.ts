export declare function formatError(error: any): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function formatAuthError(message?: string): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function formatJsonContent(data: any): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function formatTextContent(text: string): {
    content: {
        type: "text";
        text: string;
    }[];
};
//# sourceMappingURL=formatters.d.ts.map