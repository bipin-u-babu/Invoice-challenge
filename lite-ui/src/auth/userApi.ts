import axiosClient from "../dataFetching/axiosClient";

async function fetchUser(userId: string): Promise<string[] | undefined> {
  return (await axiosClient.get(`/users/${userId}`)).data;
}

export { fetchUser };
