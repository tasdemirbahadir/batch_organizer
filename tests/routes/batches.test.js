import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoUnit from "mongo-unit";

let server;

chai.use(chaiHttp);
describe("Batches", () => {
  before((done) => {
    server = require("../../src/app/server");
    done();
  });
  after((done) => {
    mongoUnit.drop();
    done();
  });
  describe("/POST batch", () => {
    it("should POST batch and response bad request when batch id is missing in header", (done) => {
      chai
        .request(server)
        .post("/batches")
        .send({ number: 1 })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors[0]).to.equal(
            "Batch ID doesn't exist in header with the key 'batch_id'. Sample header: batch_id=<string_val>"
          );
          done();
        });
    });
    it("should POST batch and response bad request when number field is missing in body", (done) => {
      chai
        .request(server)
        .post("/batches")
        .set("batch_id", "BATCH_ID_1")
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(1);
          expect(res.body.errors[0]).to.equal(
            "Data 'number' doesn't exist in body. Sample body: { number: <integer_val> }"
          );
          done();
        });
    });
    it("should POST batch and response bad request errors when number field is missing in body and batch id is missing in header", (done) => {
      chai
        .request(server)
        .post("/batches")
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.errors.length).to.equal(2);
          expect(res.body.errors).to.have.members([
            "Data 'number' doesn't exist in body. Sample body: { number: <integer_val> }",
            "Batch ID doesn't exist in header with the key 'batch_id'. Sample header: batch_id=<string_val>",
          ]);
          done();
        });
    });
    it("should POST batch successfully", (done) => {
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
  });
  describe("/GET batches", () => {
    it("should GET posted batch successfully", (done) => {
      chai
        .request(server)
        .get("/batches")
        .query({
          page: 0,
          size: 1,
        })
        .end((err, res) => {
          expect(res.body.items.length).to.equal(1);
          expect(res.body.items[0].batch_id).to.equal("BATCH_ID_1");
          expect(res.body.items[0].value).to.equal(1);
          done();
        });
    });
  });
});
