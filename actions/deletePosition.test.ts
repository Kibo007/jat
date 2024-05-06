import { onDeleteAction, Response } from "./deletePosition";
import { vi } from "vitest";
import { revalidatePath } from "next/cache";

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
// Mock the createClient function
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
      delete: vi.fn(() => ({
        in: vi.fn(() => ({
          error,
        })),
      })),
    })),
  })),
}));

// Mock the revalidatePath function
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

describe("onDeleteAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should delete positions and revalidate path", async () => {
    const ids = [1, 2, 3];
    const response: Response = await onDeleteAction(ids);

    expect(response.message).toBe("success");
    expect(revalidatePath).toHaveBeenCalledWith("/positions");
  });

  it("should return an error message if user is not authenticated", async () => {
    user = null;

    const ids = [1, 2, 3];

    const response: Response = await onDeleteAction(ids);

    expect(response.message).toBe("User is not authentificated with server");
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("should return an error message if delete operation fails", async () => {
    user = {
      id: 123,
    };
    error = {
      message: "Delete operation failed",
    };
    const ids = [1, 2, 3];
    const response: Response = await onDeleteAction(ids);

    expect(JSON.parse(response.message)).toStrictEqual({
      message: "Delete operation failed",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
