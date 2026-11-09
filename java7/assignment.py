"""Real-time detection of repeated failed logins by IP address.

The implementation uses Python dictionaries and sets as hash tables and a
deque for each IP's sliding-window history.  Processing a failure is therefore
amortized O(1), apart from building an alert once when an IP is blacklisted.
"""

from __future__ import annotations

from collections import deque
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Deque, Iterable, Mapping


TIMESTAMP_FORMAT = "%Y-%m-%d %H:%M:%S"


@dataclass(frozen=True)
class FailedAttempt:
    """One failed login kept inside an IP's active time window."""

    timestamp: datetime
    server: str


@dataclass(frozen=True)
class Alert:
    """Information produced when an IP first reaches the threshold."""

    timestamp: datetime
    ip: str
    attempt_count: int
    elapsed_minutes: float
    servers: tuple[str, ...]
    status: str = "BLACKLISTED"

    def __str__(self) -> str:
        elapsed = (
            str(int(self.elapsed_minutes))
            if self.elapsed_minutes.is_integer()
            else f"{self.elapsed_minutes:.2f}"
        )
        return (
            f"ALERT at {self.timestamp.strftime(TIMESTAMP_FORMAT)}:\n"
            f"IP: {self.ip} - {self.attempt_count} failed attempts "
            f"in {elapsed} minutes\n"
            f"Servers affected: {', '.join(self.servers)}\n"
            f"Status: {self.status}"
        )


class NetworkIntrusionDetector:
    """Track failed logins and blacklist IPs that cross a threshold.

    Logs must arrive in chronological order, as expected from a real-time
    stream.  An IP remains blacklisted after its first alert.
    """

    def __init__(self, threshold: int, window_minutes: float) -> None:
        if not isinstance(threshold, int) or isinstance(threshold, bool):
            raise TypeError("threshold must be an integer")
        if threshold <= 0:
            raise ValueError("threshold must be greater than zero")
        if isinstance(window_minutes, bool) or not isinstance(
            window_minutes, (int, float)
        ):
            raise TypeError("window_minutes must be a number")
        if window_minutes <= 0:
            raise ValueError("window_minutes must be greater than zero")

        self.threshold = threshold
        self.window = timedelta(minutes=window_minutes)

        # Both structures are hash tables in Python.
        self._failures: dict[str, Deque[FailedAttempt]] = {}
        self._blacklisted: set[str] = set()
        self._last_timestamp: datetime | None = None

    @staticmethod
    def _parse_timestamp(value: object) -> datetime:
        if isinstance(value, datetime):
            return value
        if not isinstance(value, str):
            raise TypeError("timestamp must be a datetime or a timestamp string")

        try:
            return datetime.strptime(value, TIMESTAMP_FORMAT)
        except ValueError as error:
            raise ValueError(
                f"timestamp must use the format {TIMESTAMP_FORMAT!r}"
            ) from error

    @staticmethod
    def _read_required_string(log: Mapping[str, object], field: str) -> str:
        value = log.get(field)
        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"{field} must be a non-empty string")
        return value.strip()

    def process_log(self, log: Mapping[str, object]) -> Alert | None:
        """Process one login log and return a new alert, if one is raised."""

        if not isinstance(log, Mapping):
            raise TypeError("log must be a mapping")

        if "timestamp" not in log:
            raise ValueError("log is missing timestamp")
        timestamp = self._parse_timestamp(log["timestamp"])

        if self._last_timestamp is not None and timestamp < self._last_timestamp:
            raise ValueError("logs must be processed in chronological order")
        self._last_timestamp = timestamp

        ip = self._read_required_string(log, "ip")
        status = self._read_required_string(log, "status").upper()
        if status not in {"SUCCESS", "FAIL", "FAILURE"}:
            raise ValueError("status must be SUCCESS, FAIL, or FAILURE")

        # Successful logins do not contribute to the failure threshold.
        if status == "SUCCESS":
            return None

        server_field = "server" if "server" in log else "server_id"
        server = self._read_required_string(log, server_field)

        history = self._failures.setdefault(ip, deque())
        window_start = timestamp - self.window

        # Inclusive boundary: an attempt exactly at window_start stays.
        while history and history[0].timestamp < window_start:
            history.popleft()

        history.append(FailedAttempt(timestamp, server))

        # The IP is alerted only once, but later failures are still recorded.
        if ip in self._blacklisted or len(history) < self.threshold:
            return None

        self._blacklisted.add(ip)
        elapsed = (history[-1].timestamp - history[0].timestamp).total_seconds() / 60
        affected_servers = tuple(sorted({attempt.server for attempt in history}))

        return Alert(
            timestamp=timestamp,
            ip=ip,
            attempt_count=len(history),
            elapsed_minutes=elapsed,
            servers=affected_servers,
        )

    def process_logs(self, logs: Iterable[Mapping[str, object]]) -> list[Alert]:
        """Process a stream of logs and return all newly generated alerts."""

        alerts: list[Alert] = []
        for log in logs:
            alert = self.process_log(log)
            if alert is not None:
                alerts.append(alert)
        return alerts

    def is_blacklisted(self, ip: str) -> bool:
        """Return whether an IP has already crossed the threshold."""

        return ip in self._blacklisted

    def recent_failure_count(self, ip: str) -> int:
        """Return the number of failures currently stored for an IP."""

        history = self._failures.get(ip)
        return len(history) if history is not None else 0


def example_logs() -> list[dict[str, str]]:
    """Return the exact log stream from the assignment."""

    return [
        {
            "timestamp": "2025-10-23 14:00:00",
            "ip": "192.168.1.100",
            "server": "WEB-01",
            "status": "FAIL",
        },
        {
            "timestamp": "2025-10-23 14:02:00",
            "ip": "192.168.1.100",
            "server": "WEB-02",
            "status": "FAIL",
        },
        {
            "timestamp": "2025-10-23 14:03:00",
            "ip": "10.0.0.50",
            "server": "WEB-01",
            "status": "SUCCESS",
        },
        {
            "timestamp": "2025-10-23 14:04:00",
            "ip": "192.168.1.100",
            "server": "WEB-03",
            "status": "FAIL",
        },
        {
            "timestamp": "2025-10-23 14:05:00",
            "ip": "192.168.1.100",
            "server": "WEB-01",
            "status": "FAIL",
        },
        {
            "timestamp": "2025-10-23 14:06:00",
            "ip": "10.0.0.75",
            "server": "WEB-02",
            "status": "FAIL",
        },
        {
            "timestamp": "2025-10-23 14:07:00",
            "ip": "10.0.0.75",
            "server": "WEB-02",
            "status": "FAIL",
        },
        {
            "timestamp": "2025-10-23 14:08:00",
            "ip": "10.0.0.75",
            "server": "WEB-03",
            "status": "FAIL",
        },
    ]


def main() -> None:
    detector = NetworkIntrusionDetector(threshold=3, window_minutes=10)
    alerts = detector.process_logs(example_logs())
    print("\n".join(str(alert) for alert in alerts))


if __name__ == "__main__":
    main()
