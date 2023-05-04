#include <drogon/drogon.h>
#include "ada.h"

int main() {
  printf("Server is running on http://0.0.0.0:4242 \n");
  printf("- Example url: http://0.0.0.0:4242/parse?url=https://www.yagiz.co\n");

  drogon::app()
      .registerHandler(
          "/parse?url={input}",
          [](const drogon::HttpRequestPtr &req,
             std::function<void(const drogon::HttpResponsePtr &)> &&callback,
             const std::string &input) {
            Json::Value json{};
            auto out = ada::parse<ada::url_aggregator>(input);
            if (!out.has_value()) {
              json["result"] = "fail";
            } else {
              json["result"] = "success";

              // Default values such as omitted value
              Json::Value default_values;
              default_values["omitted"] = ada::url_components::omitted;
              json["default"] = default_values;

              json["href"] = std::string(out->get_href());
              json["type"] = out->type;

              // Return components
              Json::Value components;
              components["protocol_end"] = out->get_components().protocol_end;
              components["username_end"] = out->get_components().username_end;
              components["host_start"] = out->get_components().host_start;
              components["host_end"] = out->get_components().host_end;
              components["port"] = out->get_components().port;
              components["pathname_start"] =
                  out->get_components().pathname_start;
              components["search_start"] = out->get_components().search_start;
              components["hash_start"] = out->get_components().hash_start;
              json["components"] = components;
            }
            auto response = drogon::HttpResponse::newHttpJsonResponse(json);
            response->addHeader("Access-Control-Allow-Origin", "*");
            callback(response);
          },
          {drogon::Get, drogon::Options})
      .addListener("0.0.0.0", 4242)
      .setThreadNum(16)
      .run();
}