import { onSubmitAction, FormState } from "./formPosition";

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

describe("onSubmitAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should return 'Invalid form data' message and fields with issues if form data is invalid", async () => {
    const prevState: FormState = { message: "" };
    const data = new FormData();
    data.append("company", "Acme Corp");
    data.append("hourlyRate", "10");
    data.append("status", "active");

    const result = await onSubmitAction(prevState, data);

    expect(result.message).toBe("Invalid form data");
    expect(result.fields).toEqual({
      company: "Acme Corp",
      hourlyRate: "10",
      status: "active",
    });
    expect(result.issues).toEqual([
      "Required",
      "Required",
      "Required",
      "Required",
      "Status must be one of: applied, interview, offer, rejected, pending.",
    ]);
  });

  it("should return 'User is not authenticated with server' message if user is not authenticated", async () => {
    user = null;
    const prevState: FormState = { message: "" };
    const data = new FormData();
    data.append("company", "Acme Corp");
    data.append("contact", "John Doe");
    data.append("description", "Lorem ipsum");
    data.append("hourlyRate", "10");
    data.append("jobTitle", "Software Engineer");
    data.append("location", "New York");
    data.append("positionUrl", "https://example.com");
    data.append("status", "applied");

    const result = await onSubmitAction(prevState, data);

    expect(result.message).toBe("User is not authentificated with server");
  });

  it("should return 'success' message if form data is valid and positionId is not provided", async () => {
    user = {
      id: 123,
    };
    const prevState: FormState = { message: "" };
    const data = new FormData();
    data.append("company", "Acme Corp");
    data.append("contact", "John Doe");
    data.append("description", "Lorem ipsum");
    data.append("hourlyRate", "10");
    data.append("jobTitle", "Software Engineer");
    data.append("location", "New York");
    data.append("positionUrl", "https://example.com");
    data.append("status", "applied");

    const result = await onSubmitAction(prevState, data);

    expect(result.message).toBe("success");
  });

  it("should return 'success' message if form data is valid and positionId is provided", async () => {
    user = {
      id: 123,
    };
    const prevState: FormState = { message: "" };
    const data = new FormData();
    data.append("company", "Acme Corp");
    data.append("contact", "John Doe");
    data.append("description", "Lorem ipsum");
    data.append("hourlyRate", "10");
    data.append("jobTitle", "Software Engineer");
    data.append("location", "New York");
    data.append("positionUrl", "https://example.com");
    data.append("status", "applied");

    const positionId = 1;

    const result = await onSubmitAction(prevState, data, positionId);

    expect(result.message).toBe("success");
  });
});
