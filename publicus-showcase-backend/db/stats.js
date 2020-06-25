import { Connection } from "./index";


export const all = async () => {
  return new Promise((resolve, reject) => {

    Connection.query('SELECT * from stats', (err, results) => {
      if(err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};


export const post = async (body) => {
  return new Promise((resolve, reject) => {
    //let utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    //let reg = {Date: utc, FirstName: "SDFSDF", LastName: "Last", MedicalProfessional: true};
    let sql = "INSERT INTO stats SET ?";
    Connection.query(sql, body, (err, results) => {
      if(err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

export const statPerDate = async () => {
  return new Promise((resolve, reject) => {
    Connection.query("SELECT COUNT(Date) AS count, " +
                          "Date AS count_date " +
                          "FROM stats " +
                          "GROUP BY Date", (err, results) => {
      if(err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};




export default {
  all,
  post,
  statPerDate
}