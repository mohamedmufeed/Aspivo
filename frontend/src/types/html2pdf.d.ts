
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
        [key: string]: unknown;
      };
      jsPDF?: {
        unit?: string;
        format?: string;
        orientation?: 'portrait' | 'landscape';
        [key: string]: unknown;
      };
      [key: string]: unknown;
    }
  
    interface Html2PdfInstance {
      from(element: HTMLElement | string): Html2PdfInstance;
      set(options: Html2PdfOptions): Html2PdfInstance;
      save(): Promise<void>;
      output(type: string, options?: object): Promise<Blob | string | ArrayBuffer>;
      then(callback: () => void): Html2PdfInstance;
      catch(callback: (error: unknown) => void): Html2PdfInstance;
      
    }
  
    function html2pdf(): Html2PdfInstance;
    function html2pdf(element: HTMLElement | string, options?: Html2PdfOptions): Html2PdfInstance;
  
    export default html2pdf;
  }