import { compareInstance, waitFor, getMethodName } from "./helpers";
import { createGlue, doneAllGlues } from "../initializer";
import { Glue42Core } from "../../glue";
import { expect } from "chai";
import { waitForArr } from "../helpers";
import { PromiseWrapper } from "../../src/utils/pw";

describe("method", () => {
    let glue1!: Glue42Core.GlueCore;
    let glue2!: Glue42Core.GlueCore;

    beforeEach(async () => {
        glue1 = await createGlue();
        glue2 = await createGlue();
    });

    afterEach(async () => {
        await doneAllGlues();
    });

    it.only("getServers returns only the servers that have registered the method", async () => {
        const methodName = getMethodName();
        await glue1.interop.register(methodName, () => { /** DO NOTHING */ });
        await glue2.interop.register(methodName + "_2", () => { /** DO NOTHING */ });

        // local check
        const method = glue1.interop.methods({ name: methodName })[0];
        const servers = method.getServers?.() || [];
        expect(servers.length).to.be.eq(1);

        // remote check
        const method2 = glue2.interop.methods({ name: methodName })[0];
        const servers2 = method2.getServers?.() || [];
        expect(servers2.length).to.be.eq(1);

        return Promise.resolve();
    });
});
