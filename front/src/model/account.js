import * as Api from '@/api';

export async function getPermissions(roleId) {
  try {
    const permissions = await Api.test({
      RoleID: roleId,
    });
    return permissions;
  } catch (err) {
    throw err;
  }
}
