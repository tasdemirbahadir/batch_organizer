import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoUnit from "mongo-unit";

let server;

chai.use(chaiHttp);
describe("Organized Batches", () => {
  before((done) => {
    server = require("../../src/app/server");
    done();
  });
  after((done) => {
    mongoUnit.drop();
    done();
  });
  describe("/POST batches", () => {
    it("should POST first value of batch 1 successfully", (done) => {
      chai
        .request(server)
        .post("/batches")
        .set("batch_id", "BATCH_ID_1")
        .send({ number: 1 })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.result).to.equal("SUCCESS");
          done();
        });
    });
    it("should POST second value of batch 1 successfully", (done) => {
      chai
        .request(server)
        .post("/batches")
        .set("batch_id", "BATCH_ID_1")
        .send({ number: 9 })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.result).to.equal("SUCCESS");
          done();
        });
    });
    it("should POST first value of batch 2 successfully", (done) => {
      chai
        .request(server)
        .post("/batches")
        .set("batch_id", "BATCH_ID_2")
        .send({ number: 103 })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.result).to.equal("SUCCESS");
          done();
        });
    });
    it("should POST first value of batch 3 successfully", (done) => {
      chai
        .request(server)
        .post("/batches")
        .set("batch_id", "BATCH_ID_3")
        .send({ number: 18 })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.result).to.equal("SUCCESS");
          done();
        });
    });
    it("should POST second value of batch 3 successfully", (done) => {
      chai
        .request(server)
        .post("/batches")
        .set("batch_id", "BATCH_ID_3")
        .send({ number: 13 })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.result).to.equal("SUCCESS");
          done();
        });
    });
    it("should POST third value of batch 1 successfully", (done) => {
      chai
        .request(server)
        .post("/batches")
        .set("batch_id", "BATCH_ID_1")
        .send({ number: 5 })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.result).to.equal("SUCCESS");
          done();
        });
    });
    it("should POST third value of batch 3 successfully", (done) => {
      chai
        .request(server)
        .post("/batches")
        .set("batch_id", "BATCH_ID_3")
        .send({ number: 14 })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.result).to.equal("SUCCESS");
          done();
        });
    });
    it("should POST second value of batch 2 successfully", (done) => {
      chai
        .request(server)
        .post("/batches")
        .set("batch_id", "BATCH_ID_2")
        .send({ number: 101 })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.result).to.equal("SUCCESS");
          done();
        });
    });
  });
  describe("/GET organized batches", () => {
    it("should get min page size error", (done) => {
      chai
        .request(server)
        .get("/batches/organized")
        .query({
          page: 0,
          size: 0,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors).to.have.members(["Min page size is 1"]);
          done();
        });
    });
    it("should get min page value error", (done) => {
      chai
        .request(server)
        .get("/batches/organized")
        .query({
          page: -1,
          size: 10,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors).to.have.members(["Min page value is 0"]);
          done();
        });
    });
    it("should get min page value and min page size error", (done) => {
      chai
        .request(server)
        .get("/batches/organized")
        .query({
          page: -1,
          size: 0,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(2);
          expect(res.body.errors).to.have.members([
            "Min page size is 1",
            "Min page value is 0",
          ]);
          done();
        });
    });
    it("should get value error when page value is not a number", (done) => {
      chai
        .request(server)
        .get("/batches/organized")
        .query({
          page: "NaN",
          size: 10,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors).to.have.members([
            "Page value must be a number",
          ]);
          done();
        });
    });
    it("should get value error when page size value is not a number", (done) => {
      chai
        .request(server)
        .get("/batches/organized")
        .query({
          page: 0,
          size: "NaN",
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors).to.have.members([
            "Page size value must be a number",
          ]);
          done();
        });
    });
    it("should get value errors when page value and page size value is not a number", (done) => {
      chai
        .request(server)
        .get("/batches/organized")
        .query({
          page: "NaN",
          size: "NaN",
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(2);
          expect(res.body.errors).to.have.members([
            "Page value must be a number",
            "Page size value must be a number",
          ]);
          done();
        });
    });
    it("should GET organized batches successfully", (done) => {
      chai
        .request(server)
        .get("/batches/organized")
        .query({
          size: 8,
        })
        .end((err, res) => {
          expect(res.body.organizedBatches.length).to.equal(8);
          expect(res.body.organizedBatches).to.have.ordered.members([
            1, 5, 9, 101, 103, 13, 14, 18,
          ]);
          done();
        });
    });
    it("should GET organized batches paginated successfully", (done) => {
      chai
        .request(server)
        .get("/batches/organized")
        .query({
          page: 2,
          size: 2,
        })
        .end((err, res) => {
          expect(res.body.organizedBatches.length).to.equal(2);
          expect(res.body.organizedBatches).to.have.ordered.members([103, 13]);
          done();
        });
    });
  });
});
