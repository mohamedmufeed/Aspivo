// Create this file at src/types/html2pdf.d.ts

declare module 'html2pdf.js' {
    interface Html2PdfOptions {
      margin?: number | [number, number, number, number];
      filename?: string;
      image?: {
        type?: string;
        quality?: number;
      };
      html2canvas?: {
        scale?: number;
        [key: string]: any;
      };
      jsPDF?: {
        unit?: string;
        format?: string;
        orientation?: 'portrait' | 'landscape';
        [key: string]: any;
      };
      [key: string]: any;
    }
  
    interface Html2PdfInstance {
      from(element: HTMLElement | string): Html2PdfInstance;
      set(options: Html2PdfOptions): Html2PdfInstance;
      save(): Promise<void>;
      output(type: string, options?: any): Promise<any>;
      then(callback: Function): Html2PdfInstance;
      catch(callback: Function): Html2PdfInstance;
    }
  
    function html2pdf(): Html2PdfInstance;
    function html2pdf(element: HTMLElement | string, options?: Html2PdfOptions): Html2PdfInstance;
  
    export default html2pdf;
  }