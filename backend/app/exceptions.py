class BusinessError(Exception):
    """業務錯誤：以 violation_type（中文錯誤訊息）回應，status_code 依 api.yml 定義。"""

    def __init__(self, violation_type: str, status_code: int = 400):
        self.violation_type = violation_type
        self.status_code = status_code
        super().__init__(violation_type)


class NotFoundError(Exception):
    def __init__(self, message: str = "Resource not found"):
        self.message = message
        super().__init__(message)
