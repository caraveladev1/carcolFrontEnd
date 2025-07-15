import { PendingTask } from '../pages/PendingTask';
import { CreateContainer } from '../pages/CreateContainer';
import { ViewContainers } from '../pages/ViewContainers';
import { EditContainer } from '../pages/EditContainer';
import { ExportedContainers } from '../pages/ExportedContainers';
import { ManageUsers } from '../pages/ManageUsers';

export const routeConfig = {
  '/view-containers': {
    component: ViewContainers,
    permissions: ['containers.view']
  },
  '/exported-containers': {
    component: ExportedContainers,
    permissions: ['containers.view']
  },
  '/pending-task': {
    component: PendingTask,
    permissions: ['tasks.view']
  },
  '/create': {
    component: CreateContainer,
    permissions: ['containers.create']
  },
  '/edit-container/:id': {
    component: EditContainer,
    permissions: ['containers.edit']
  },
  '/admin/manage-users': {
    component: ManageUsers,
    permissions: ['users.view']
  }
};