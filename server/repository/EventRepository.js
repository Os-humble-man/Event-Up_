const DatabaseManager = require("../_core/DatabaseManager");
const { logger } = require("../_core/Logger");

const db = DatabaseManager.getInstance().getPool();

const EventRepository = {
  async getEvents() {
    const connexion = await db.getConnection();
    try {
      await connexion.beginTransaction();
      const query = `
            SELECT * 
            FROM events 
            INNER JOIN categories ON categories.id = events.category_id 
            INNER JOIN users ON users.id = events.user_id`;
      const [rows] = await connexion.query(query);
      return rows;
    } catch (error) {
      logger.error(`Error: ${error.message}`);
    } finally {
      connexion.release();
    }
  },
  async addEvent(data,coverPath) {

    
    const connexion = await db.getConnection();
    try {
      await connexion.beginTransaction();
      const query = `INSERT INTO events
                      (title,cover_image,description, start_date, end_date, location_details, user_id, category_id) 
                    VALUES(?,?,?,?,?,?,?,?)`;
  
      const [rows] = await connexion.query(query, [
        data.title,
        coverPath,
        data.description,
        data.startDate,
        data.endDate,
        data.locationName,
        1, // ID utilisateur (vous pouvez le remplacer dynamiquement)
        data.category,
      ]);
  
      // console.log(rows);
      
      await connexion.commit();
      return rows;
    } catch (error) {
      await connexion.rollback();
      logger.error(`Error: ${error.message}`);
      throw error;
    } finally {
      connexion.release();
    }
  }
  ,

  async addImage(id, filePaths) {

    // console.log('filepaths',filePaths);
    // console.log('id', id);
    
    
    const connexion = await db.getConnection();

    
    try {
      await connexion.beginTransaction();
      
      const query = `INSERT INTO event_images (event_id, image_url) VALUES(?,?) `;
      console.log(query, id, filePaths );
        const result = await connexion.query(query, [id, filePaths]);
        console.log(result);
        
        if (result.affectedRows > 0) {
            return {
                status: 200,
                message: "Image Added",
                Inserted: true,
            };    
        } else {
            return {
                status: 500,
                message: "Image Failed",
            };
        }
    } catch (error) {
        logger.error("Add Image Error: " + error.message);
        throw new Error(`Add Image: ${error.message}`);
    }finally{
      await connexion.release();
    }
},

  async getCategory() {
    const connexion = await db.getConnection();
    try {
      await connexion.beginTransaction();
      const [rows] = await connexion.query("SELECT * FROM categories");

      return rows;
    } catch (error) {
      logger.error(`Error: ${error.message}`);
    } finally {
      connexion.release();
    }
  },
};

module.exports = EventRepository;
