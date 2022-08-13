export const SequelizeArrayDataToJSON = (data) => [...data.map((item: any) => item.toJSON())];

export const arrangeSequelizeInterfaceData = ({ data }) => ({ data: SequelizeArrayDataToJSON(data.rows), total: data.count });

