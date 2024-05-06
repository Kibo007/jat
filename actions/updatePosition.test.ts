import { PositionStatus } from "@/types/common";
import { onUpdatePosition, Response } from "./updatePosition";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { MockedFunction } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

type User = {
  id: number;
};
let user: User | null = {
  id: 123,
};

type Error = {
  message: string;
};
let error: null | Error = null;

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => ({
        data: {
          user,
        },
      })),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          error,
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          error,
        })),
      })),
    })),
  })),
}));

describe("onUpdatePosition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update the position and return success message", async () => {
    const id = 1;
    const payload = {
      status: "applied" as PositionStatus,
      excitement: 5,
    };

    const response: Response = await onUpdatePosition(id, payload);

    expect(response).toEqual({ message: "success" });
  });

  it("should return an error message if there is an error updating the position", async () => {
    const id = 22222;
    const payload = {
      status: "applied" as PositionStatus,
      excitement: 5,
    };
    error = { message: "item with id  22222 does not exist" };

    const response: Response = await onUpdatePosition(id, payload);

    expect(JSON.parse(response.message)).toStrictEqual(error);
  });
});
