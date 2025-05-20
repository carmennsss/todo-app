import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubtasksService {
  private SUBTASKS_URL = environment.apiClientUrl + '/tasks-subtasks/';

  constructor() { }

}
