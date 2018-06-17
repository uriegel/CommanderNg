#include <nan.h>
#include <string>
#include "utils.h"
using namespace std;
using namespace Nan;
using namespace v8;

NAN_METHOD(GetTest) {
	Utf8String val(To<String>(info[0]).ToLocalChecked());
	auto input = Utf8Decode(*val);

    info.GetReturnValue().Set(New<String>("das Ergebnis").ToLocalChecked());
}

NAN_MODULE_INIT(init) {
	Nan::Set(target, New<String>("getTest").ToLocalChecked(), GetFunction(New<FunctionTemplate>(GetTest)).ToLocalChecked());
}

NODE_MODULE(addon, init)