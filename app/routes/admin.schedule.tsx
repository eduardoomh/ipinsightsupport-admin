import { json, type LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  useSearchParams,
  useNavigation,
} from "@remix-run/react";
import {
  Calendar,
  Card,
  Typography,
  ConfigProvider,
  Select,
  Row,
  Col,
  Tooltip,
  Skeleton,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";

const { Title, Text } = Typography;

/* =========================
   Tipos
========================= */

type Entry = {
  hours_billed: number;
  company: string;
};

type Payment = {
  amount: number;
  company: string;
};

type Schedule = {
  status: string;
  company: string;
};

type DayData = {
  entries: Entry[];
  payments: Payment[];
  schedule: Schedule[];
};

type LoaderData = {
  calendarData?: Record<string, DayData>;
};

/* =========================
   Loader (SIN CAMBIOS)
========================= */

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const month = url.searchParams.get("month") || dayjs().format("YYYY-MM");

  const response = await fetch(
    `${process.env.APP_URL}/api/calendar/?month=${month}`,
    {
      headers: { Cookie: request.headers.get("Cookie") || "" }
    }
  );

  return json(await response.json());
};

/* =========================
   Vista
========================= */

export default function CalendarPage() {
  const data = useLoaderData<LoaderData>();
  const calendarData = data.calendarData ?? {};
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  /* -------------------------
     Mes desde la URL
  -------------------------- */
  const monthParam = searchParams.get("month") ?? dayjs().format("YYYY-MM");

  const calendarValue = useMemo(
    () => dayjs(monthParam),
    [monthParam]
  );

  /* -------------------------
     Total horas
  -------------------------- */
  const totalHours = useMemo(() => {
    return Object.values(calendarData).reduce((acc, day) => {
      return acc + day.entries.reduce((s, e) => s + e.hours_billed, 0);
    }, 0);
  }, [calendarData]);

  /* -------------------------
     Render de día (PURO)
  -------------------------- */
  const renderDateCell = (date: Dayjs) => {
    const key = date.format("YYYY-MM-DD");
    const day = calendarData[key];
    if (!day) return null;

    return (
      <div className="flex flex-col gap-1">
        {day.entries.map((e, i) => (
          <Tooltip
            key={`e-${i}`}
            title={`${e.company} · ${e.hours_billed}h`}
          >
            <div className="bg-sky-100 border-l-2 border-sky-500 text-[10px] px-1 py-0.5 truncate">
              WORK · {e.company}
            </div>
          </Tooltip>
        ))}

        {day.payments.map((p, i) => (
          <div
            key={`p-${i}`}
            className="bg-emerald-100 border-l-2 border-emerald-500 text-[10px] px-1 py-0.5 truncate"
          >
            PAYMENT · ${p.amount}
          </div>
        ))}
      </div>
    );
  };

  /* =========================
     Render
  ========================= */

  return (
    <DashboardLayout title="Schedule">
      <Card className="border-none shadow-md">
        <ConfigProvider>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 10 }} />
          ) : (
            <Calendar
              value={calendarValue}
              cellRender={renderDateCell}
              headerRender={({ value }) => {
                const year = value.year();
                const month = value.month();

                const change = (y: number, m: number) => {
                  const next = value.year(y).month(m);
                  setSearchParams({ month: next.format("YYYY-MM") });
                };

                return (
                  <div className="p-4 border-b bg-white">
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Title level={4} style={{ margin: 0 }}>
                          {value.format("MMMM YYYY")}
                        </Title>
                      </Col>

                      <Col>
                        <Row gutter={8} align="middle">
                          <Col>
                            <Select
                              size="small"
                              value={year}
                              onChange={(y) => change(y, month)}
                            >
                              {Array.from({ length: 20 }).map((_, i) => {
                                const y = year - 10 + i;
                                return (
                                  <Select.Option key={y} value={y}>
                                    {y}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Col>

                          <Col>
                            <Select
                              size="small"
                              value={month}
                              onChange={(m) => change(year, m)}
                            >
                              {Array.from({ length: 12 }).map((_, i) => (
                                <Select.Option key={i} value={i}>
                                  {dayjs().month(i).format("MMMM")}
                                </Select.Option>
                              ))}
                            </Select>
                          </Col>

                          <Col>
                            <Text className="ml-3 font-bold text-emerald-700">
                              Total: {totalHours}h
                            </Text>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                );
              }}
            />
          )}
        </ConfigProvider>
      </Card>
    </DashboardLayout>
  );
}