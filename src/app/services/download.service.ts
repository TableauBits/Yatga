import { Injectable } from '@angular/core';

// Source : https://stackblitz.com/edit/httpsstackoverflowcomquestions51806464how-to-create-and-downloa?file=src%2Fapp%2Fapp.component.ts

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  private setting = {
    element: {
      dynamicDownload: null as unknown as HTMLElement
    }
  };

  constructor() { }

  public dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }
}
