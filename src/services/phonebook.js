import axios from "axios";
const baseUrl = "/api/persons";

// const getAll = () => {
//   const request = axios.get(baseUrl);
//   const nonExistsPerson = {
//     name: "Abdul",
//     number: "777777",
//     id: "1000",
//   };
//   return request.then((response) => response.data.concat(nonExistsPerson));
// };
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const update = (id, updatedPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedPerson);
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  delete: remove,
  update,
};
