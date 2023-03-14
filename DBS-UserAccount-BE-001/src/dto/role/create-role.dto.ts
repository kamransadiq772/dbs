export class CreateRoleDto {
  role: string;
  precedence?: number;
  description?: string;
  // defaultPermissions: string[]
  defaultPermissions: []
}
