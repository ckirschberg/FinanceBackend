import { EntryService } from "../src/entry/entry.service";

export class MockEntryService extends EntryService
{
    async saveImage(base64Image: string) : Promise<string> {
        return "This is a mock";
    }
}