import { Glue42Core } from "../../glue";
import { createGlue, doneAllGlues } from "../initializer";
import { generate } from "shortid";

// tslint:disable-next-line:only-arrow-functions
describe.only("contexts.subscribe", function() {
    let glue!: Glue42Core.GlueCore;

    function getContextName() {
        return generate();
    }

    beforeEach(async () => {
        glue = await createGlue();
    });

    afterEach(async () => {
        await doneAllGlues();
    });

    it("Should replay current context when the last updater was 'my' app",  (done) => {
        const name = getContextName();
        glue.contexts.set(name, { test: "value" })
            .then(() => {
                setTimeout(() => done("Did not replay !"), 3000);
                glue.contexts.subscribe(name, () => {
                    done();
                });
            });
    });
});
