declare module 'pdfkit-table' {
    import PDFDocument = require('pdfkit');

    interface TableData {
        title?: string;
        subtitle?: string;
        headers?: string[];
        rows?: string[][];
    }

    interface TableOptions {
        columnsSize?: number[];
        width?: number;
        x?: number;
        y?: number;
        divider?: {
            header?: { disabled?: boolean; width?: number; opacity?: number };
            horizontal?: { disabled?: boolean; width?: number; opacity?: number };
        };
        padding?: number;
        columnSpacing?: number;
        hideHeader?: boolean;
        minRowHeight?: number;
        prepareHeader?: () => any;
        prepareRow?: (row: any, indexKey: number, indexRow: number, rectRow: any, rectCell: any) => any;
    }

    class PDFDocumentWithTables extends PDFDocument {
        constructor(options?: any);
        table(table: TableData, options?: TableOptions): Promise<void>;
    }

    export = PDFDocumentWithTables;
}
