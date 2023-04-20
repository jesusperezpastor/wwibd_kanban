export interface TaskSchema {
  id: string;
  name: string;
  assignedTo: string;
  type: string;
  tag: string;
  description: string;
  dateDeserve: Date | string;
  priority: string;
  dateStart: string;
  dateEnd: string;
  dateCreation: string;
  cycleTime: string;
  listId?: string;
}