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
    it("should GET organized batches successfully", (done) => {
      chai
        .request(server)
        .get("/batches/organized")
        .end((err, res) => {
          expect(res.body.values.length).to.equal(8);
          expect(res.body.values).to.have.ordered.members([
            1, 5, 9, 101, 103, 13, 14, 18,
          ]);
          done();
        });
    });
  });
});
